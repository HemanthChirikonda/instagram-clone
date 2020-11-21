import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import { db, auth } from "./firebaseconfig";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import Imageupload from "./components/Imageupload";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,

		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);
	const [posts, setposts] = useState([]);
	const [open, setopen] = useState(false);
	const [openSignIn, setopenSignIn] = useState(false);
	const [userName, setuserName] = useState("");
	const [email, setemail] = useState("");
	const [password, setpassword] = useState("");
	const [user, setuser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// user logged in...
				setuser(authUser);
			} else {
				// user logged out...
				setuser(null);
			}
		});
	}, []);

	//  useEffect is a piece of code which runs based on specific condetion
	useEffect(() => {
		// this is where code runs
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setposts(
					snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
				);
			});
	}, []);

	const handleuserName = (e) => {
		setuserName(e.target.value);
	};

	const handleuserEmail = (e) => {
		setemail(e.target.value);
	};

	const handleuserPassword = (e) => {
		setpassword(e.target.value);
	};

	const handleSignUp = (e) => {
		e.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: userName,
				});
			})
			.catch((error) => alert(error.message));
		setopen(false);
	};

	const handleSignIn = (e) => {
		e.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message));

		setopenSignIn(false);
	};

	return (
		<div className="app">
			{/* header */}

			<div className="app_header">
				<img
					className="app_header_image"
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>
				{user ? (
					<Button
						onClick={() => {
							auth.signOut();
						}}
					>
						Logout
					</Button>
				) : (
					<div className="app_login_Container">
						<Button
							onClick={() => {
								setopenSignIn(true);
							}}
						>
							Sign In
						</Button>
						<Button
							onClick={() => {
								setopen(true);
							}}
						>
							Sign up
						</Button>
					</div>
				)}
			</div>

			<Modal open={open} onClose={() => setopen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app_signup">
						<center>
							<img
								className="app_header-image"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							type="text"
							placeholder="user name"
							value={userName}
							onChange={handleuserName}
						/>
						<Input
							type="Email"
							placeholder="user Email"
							value={email}
							onChange={handleuserEmail}
						/>
						<Input
							type="password"
							placeholder="user password"
							value={password}
							onChange={handleuserPassword}
						/>
						<Button onClick={handleSignUp}>Sign Up</Button>
					</form>
				</div>
			</Modal>

			<Modal open={openSignIn} onClose={() => setopenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app_signup">
						<center>
							<img
								className="app_header-image"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							type="Email"
							placeholder="user Email"
							value={email}
							onChange={handleuserEmail}
						/>
						<Input
							type="password"
							placeholder="user password"
							value={password}
							onChange={handleuserPassword}
						/>
						<Button onClick={handleSignIn}>Sign IN</Button>
					</form>
				</div>
			</Modal>

			{/* posts */}
			<div className={"app_posts"}>
				{posts.map(({ id, post }) => {
					return (
						<Post
							key={id}
							user={user ? user : ""}
							postID={id}
							userName={post.userName}
							caption={post.caption}
							imageUrl={post.imageUrl}
						/>
					);
				})}
			</div>
			{user?.displayName ? (
				<Imageupload username={user.displayName} />
			) : (
				<h3 style={{ padding: "20px" }}>
					<center>Login to Upload</center>
				</h3>
			)}
		</div>
	);
}

export default App;
