import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import { db, storage } from "../firebaseconfig";
import firebase from "firebase";
import "./Imageupload.css";

function Imageupload({ username }) {
	const [image, setimage] = useState(null);
	const [caption, setcaption] = useState("");
	const [progress, setprogress] = useState(0);

	const handlefilechange = (e) => {
		if (e.target.files[0]) {
			setimage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				//Progress logic function....
				const progres = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);

				setprogress(progres);
			},
			(error) => {
				// Error function.......
				console.log(error);
			},
			() => {
				// complete function.....
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							userName: username,
							caption: caption,
							imageUrl: url,
						});
					});
				setprogress(0);
				setcaption("");
				setimage(null);
			}
		);
	};

	return (
		<div className="image_upload">
			{/* I want here.... */}
			<progress
				className="image_upload_progress"
				value={`${progress}`}
				max={"100"}
			/>
			{/* caption */}

			<Input
				type="text"
				placeholder="Enter caption here..."
				value={caption}
				required
				onChange={(e) => setcaption(e.target.value)}
			/>
			{/* file picker */}
			<input type="file" onChange={handlefilechange} required />
			<Button onClick={handleUpload}>upload</Button>
		</div>
	);
}

export default Imageupload;
