const nativeRequire = window.native_require;
const { dialog } = nativeRequire("electron");
//.avi .mpg .mpeg .wmv .wma .asf .mid .mp3
export default function openFolder() {
	return new Promise((resolve, reject) => {
		try {
			dialog.showOpenDialog(
				{
					properties: ["openFile"],
					filters: [
						{
							name: "video",
							extensions: ["avi", "mp4", "mkv", "rmvb"],
						},
					],
				},
				(res) => {
					resolve(res);
				}
			);
		} catch (e) {
			reject(e);
		}
	});
}
