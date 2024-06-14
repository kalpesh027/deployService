import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.ACCESS_SECRET,
    endpoint: process.env.ENDPOINT,
})

export async function downloadS3Folder(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: 'vercel',
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({ Key }) => {
        return new Promise<void>(async (resolve) => {
            if (!Key) {
                resolve();
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            console.log(`Downloading file to: ${finalOutputPath}`);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: 'vercel',
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve();
            });
        });
    }) || [];

    await Promise.all(allPromises);
}

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        const relativePath = path.relative(folderPath, file);
        const cloudPath = path.join('dist', id, relativePath);
        uploadFile(cloudPath, file);
    });
}

const getAllFiles = (folderPath: string): string[] => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
};

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: 'vercel',
        Key: fileName.replace(/\\/g, '/')
    }).promise();
    console.log(response);
};