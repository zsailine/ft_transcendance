const getImageUrlFromBlob = (data: any): string | null => {
    let url: string | null = null;
    let uint8Array;

    if (data) {
        try {
            if (data.data)
                uint8Array = new Uint8Array(data.data);
            else
                uint8Array = new Uint8Array(data);
            const blob = new Blob([uint8Array], { type: 'image/jpeg' });
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
