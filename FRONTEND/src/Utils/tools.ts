export function generateRoom() {
	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMBNOPQRSTUVWXYZ123456789"
	let i = 0;
	let result = "";
	while (i < 26) {
		result += alphabet[Math.floor(Math.random() * alphabet.length)];
		i++;
	}
	return (result);
}