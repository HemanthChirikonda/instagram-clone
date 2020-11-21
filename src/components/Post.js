import React, { useState, useEffect } from "react";
import "./Post.css";
import { db, storage } from "../firebaseconfig";
import { Avatar } from "@material-ui/core";
import firebase from "firebase";

function Post({ user, userName, postID, caption, imageUrl }) {
	const [comments, setcomments] = useState([]);
	const [comment, setcomment] = useState("");
	useEffect(() => {
		let unsubscribe;
		if (postID) {
			unsubscribe = db
				.collection("posts")
				.doc(postID)
				.collection("comments")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) => {
					setcomments(snapshot.docs.map((doc) => doc.data()));
				});
		}

		return () => {
			unsubscribe();
		};
	}, [postID]);

	const postcomment = (e) => {
		e.preventDefault();

		if (user) {
			db.collection("posts").doc(postID).collection("comments").add({
				text: comment,
				userName: user.displayName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		}
		setcomment("");
	};
	return (
		<div className="post">
			{/* header > avatar > username */}

			<div className="post_header">
				<Avatar className="post_avatar" src=".." alt="hemanth" />
				<h3>{userName}</h3>
			</div>

			{/* image */}
			<img className="post_image" src={imageUrl} alt="" />

			{/* username > caption */}
			<h4 className="post_text">
				<strong style={{ paddingRight: "10px" }}>{userName}</strong>
				{caption}
			</h4>
			<div className="post_comments">
				{comments.map((coment) => {
					return (
						<p key={coment.text}>
							<strong>{coment.userName}</strong> {coment.text}
						</p>
					);
				})}
			</div>
			{user && (
				<form className="post_commentbox">
					<input
						className="post_comment_input"
						type="text"
						value={comment}
						placeholder="add comment..."
						onChange={(e) => setcomment(e.target.value)}
					/>
					<button className="post_comment_button" onClick={postcomment}>
						Post
					</button>
				</form>
			)}
		</div>
	);
}

export default Post;
