export async function uploadImageToCloudinary(imageFile) {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "doveme");

    try {
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/doveme/image/upload",
            {
                method: "POST",
                body: data,
            }
        );

        if (res.ok) {
            const imageData = await res.json();
            return imageData.secure_url;
        } else {
            throw new Error("Failed to upload the image.");
        }
    } catch (error) {
        throw new Error("An error occurred while uploading the image.");
    }
}
