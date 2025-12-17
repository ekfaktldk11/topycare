import { uploadData, getUrl } from "aws-amplify/storage";

/**
 * S3에 이미지 파일을 업로드하고 public URL을 반환합니다.
 * @param file - 업로드할 파일
 * @param path - 저장 경로 (기본값: public/)
 * @returns 업로드된 파일의 public URL
 */
export async function uploadImage(
    file: File,
    path: string = "public/"
): Promise<{ url: string | null; error: string | null }> {
    try {
        // 파일 확장자 추출
        const fileExtension = file.name.split(".").pop();
        // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const fileName = `${path}${timestamp}-${randomStr}.${fileExtension}`;

        // S3에 업로드
        const result = await uploadData({
            path: fileName,
            data: file,
            options: {
                contentType: file.type,
            },
        }).result;

        // 업로드된 파일의 URL 가져오기
        const urlResult = await getUrl({
            path: result.path,
        });

        return {
            url: urlResult.url.toString(),
            error: null,
        };
    } catch (error) {
        console.error("Error uploading image:", error);
        return {
            url: null,
            error:
                error instanceof Error
                    ? error.message
                    : "알 수 없는 오류가 발생했습니다.",
        };
    }
}

///**
// * 여러 이미지를 한번에 업로드합니다.
// */
//export async function uploadMultipleImages(
//    files: File[],
//    path: string = "public/"
//): Promise<{ urls: string[]; errors: string[] }> {
//    const results = await Promise.all(
//        files.map((file) => uploadImage(file, path))
//    );

//    return {
//        urls: results.filter((r) => r.url).map((r) => r.url!),
//        errors: results.filter((r) => r.error).map((r) => r.error!),
//    };
//}
