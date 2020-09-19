import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";

import MainListItems from "./MainListItems";
import NotificationsPopOver from "../NotificationsPopOver";
import { AuthContext } from "../../context/Auth/AuthContext";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		height: "100vh",
	},

	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: "0 8px",
		minHeight: "48px",
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: "none",
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: "hidden",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: {
		minHeight: "48px",
	},
	content: {
		flex: 1,
		overflow: "auto",
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
}));

const MainDrawer = ({ appTitle, children }) => {
	const { handleLogout } = useContext(AuthContext);
	const classes = useStyles();
	const [open, setOpen] = useState(true);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const drawerState = localStorage.getItem("drawerOpen");

	useEffect(() => {
		if (drawerState === "0") {
			setOpen(false);
		}
	}, [drawerState]);

	const handleDrawerOpen = () => {
		setOpen(true);
		localStorage.setItem("drawerOpen", 1);
	};

	const handleDrawerClose = () => {
		setOpen(false);
		localStorage.setItem("drawerOpen", 0);
	};

	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
		setMenuOpen(true);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setMenuOpen(false);
	};

	return (
		<div className={classes.root}>
			<Drawer
				variant="permanent"
				classes={{
					paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
				}}
				open={open}
			>
				<div className={classes.toolbarIcon}>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List>
					<MainListItems />
				</List>
				<Divider />
			</Drawer>
			<AppBar
				position="absolute"
				className={clsx(classes.appBar, open && classes.appBarShift)}
				color={process.env.NODE_ENV === "development" ? "inherit" : "primary"}
			>
				<Toolbar variant="dense" className={classes.toolbar}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						className={clsx(
							classes.menuButton,
							open && classes.menuButtonHidden
						)}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						component="h1"
						variant="h6"
						color="inherit"
						noWrap
						className={classes.title}
					>
						{appTitle}
					</Typography>
					<NotificationsPopOver />

					<div>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={menuOpen}
							onClose={handleCloseMenu}
						>
							<MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />

				{children ? children : null}
			</main>
		</div>
	);
};

export default MainDrawer;
