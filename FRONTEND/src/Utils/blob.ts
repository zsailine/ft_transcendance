const getImageUrlFromBlob = (data: any): string | null => {
    let url: string | null = null;

    if (data) {
        try {
            let uint8Array:ArrayBuffer = new Uint8Array(data);
            if (data instanceof ArrayBuffer) {
                uint8Array = data;
                console.log("NIDITRA TATO");
            }
            const blob = new Blob([uint8Array], { type: 'image/png' });
            url = URL.createObjectURL(blob);
            return url;
        } catch (error) {
            console.error('Error creating image URL from blob:', error);
            return null;
        }
    }

    return null;
}

export { getImageUrlFromBlob };
