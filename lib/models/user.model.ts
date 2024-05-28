import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
	id: { type: String, required: true },
	username: {
		type: String,
		unique: true,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	bio: {
		type: String,
	},
	threads: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Threads",
		},
	],
	onboarded: {
		type: Boolean,
		default: false,
	},
	communites: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Community",
		},
	],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

//Export the model
export default User;
