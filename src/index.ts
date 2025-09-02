import * as encoding from "@oslojs/encoding";

export class ActionInvocationRequestResolver {
	public actions: Actions;

	constructor(actions: Actions) {
		this.actions = actions;
	}

	public async resolveRequest(body: string): Promise<string> {
		const parsed = JSON.parse(body);

		if (typeof parsed !== "object" || parsed === null) {
			throw new Error("Invalid request object");
		}

		if (!("action" in parsed) || typeof parsed.action !== "string") {
			throw new Error("Missing or invalid 'action' field");
		}
		const action = parsed.action;

		if (
			!("arguments" in parsed) ||
			typeof parsed.arguments !== "object" ||
			parsed.arguments === null
		) {
			throw new Error("Missing or invalid 'arguments' field");
		}
		const actionArguments = parsed.arguments;

		const resultJSON = await this.invokeAction(action, actionArguments);

		return resultJSON;
	}

	private async invokeAction(action: string, argumentsJSONObject: object): Promise<string> {
		switch (action) {
			case "create_user": {
				const resultJSON = await this.invokeCreateUserAction(argumentsJSONObject);
				return resultJSON;
			}
			case "get_user": {
				const resultJSON = await this.invokeGetUserAction(argumentsJSONObject);
				return resultJSON;
			}
			case "get_user_by_email_address": {
				const resultJSON = await this.invokeGetUserByEmailAddressAction(argumentsJSONObject);
				return resultJSON;
			}
			case "update_user_email_address": {
				const resultJSON = await this.invokeUpdateUserEmailAddressAction(argumentsJSONObject);
				return resultJSON;
			}
			case "update_user_password_hash": {
				const resultJSON = await this.invokeUpdateUserPasswordHashAction(argumentsJSONObject);
				return resultJSON;
			}
			case "increment_user_sessions_counter": {
				const resultJSON = await this.invokeIncrementUserSessionsCounterAction(argumentsJSONObject);
				return resultJSON;
			}
			case "delete_user": {
				const resultJSON = await this.invokeDeleteUserAction(argumentsJSONObject);
				return resultJSON;
			}
		}

		throw new Error(`Unknown action ${action}`);
	}

	private async invokeCreateUserAction(argumentsJSONObject: object): Promise<string> {
		if (
			!("email_address" in argumentsJSONObject) ||
			typeof argumentsJSONObject.email_address != "string"
		) {
			throw new Error("Invalid or missing 'email_address' field");
		}
		const emailAddress = argumentsJSONObject.email_address;

		if (
			!("password_hash" in argumentsJSONObject) ||
			typeof argumentsJSONObject.password_hash != "string"
		) {
			throw new Error("Invalid or missing 'password_hash' field");
		}
		let passwordHash: Uint8Array;
		try {
			passwordHash = encoding.decodeBase64(argumentsJSONObject.password_hash);
		} catch {
			throw new Error("Invalid or missing 'password_hash' field");
		}

		if (
			!("password_hash_algorithm_id" in argumentsJSONObject) ||
			typeof argumentsJSONObject.password_hash_algorithm_id != "string"
		) {
			throw new Error("Invalid or missing 'password_hash_algorithm_id' field");
		}
		const passwordHashAlgorithmId = argumentsJSONObject.password_hash_algorithm_id;

		if (
			!("password_salt" in argumentsJSONObject) ||
			typeof argumentsJSONObject.password_salt != "string"
		) {
			throw new Error("Invalid or missing 'password_salt' field");
		}
		let passwordSalt: Uint8Array;
		try {
			passwordSalt = encoding.decodeBase64(argumentsJSONObject.password_salt);
		} catch {
			throw new Error("Invalid or missing 'password_salt' field");
		}

		const actionInvocationId = generateActionInvocationId();

		let user: User;
		try {
			user = await this.actions.createUserAction(
				actionInvocationId,
				emailAddress,
				passwordHash,
				passwordHashAlgorithmId,
				passwordSalt
			);
		} catch (e) {
			if (e instanceof ActionError) {
				const result = createActionInvocationErrorResultJSON(actionInvocationId, e.errorCode);
				return result;
			}
			throw new Error("Unknown error", {
				cause: e
			});
		}

		const resultJSONObject = {
			ok: true,
			action_invocation_id: actionInvocationId,
			user: {
				id: user.id,
				email_address: user.emailAddress,
				password_hash: encoding.encodeBase64(user.passwordHash),
				password_hash_algorithm_id: user.passwordHashAlgorithmId,
				password_salt: encoding.encodeBase64(user.passwordSalt),
				disabled: user.disabled,
				display_name: user.displayName,
				email_address_counter: user.emailAddressCounter,
				password_hash_counter: user.passwordHashCounter,
				disabled_counter: user.disabledCounter,
				sessions_counter: user.sessionsCounter
			}
		};

		const resultJSON = JSON.stringify(resultJSONObject);
		return resultJSON;
	}

	private async invokeGetUserAction(argumentsJSONObject: object): Promise<string> {
		if (!("user_id" in argumentsJSONObject) || typeof argumentsJSONObject.user_id != "string") {
			throw new Error("Invalid or missing field 'user_id'");
		}
		const userId = argumentsJSONObject.user_id;

		const actionInvocationId = generateActionInvocationId();

		let user: User;
		try {
			user = await this.actions.getUserAction(actionInvocationId, userId);
		} catch (e) {
			if (e instanceof ActionError) {
				const result = createActionInvocationErrorResultJSON(actionInvocationId, e.errorCode);
				return result;
			}
			throw new Error("Unknown error", {
				cause: e
			});
		}

		const resultJSONObject = {
			ok: true,
			action_invocation_id: actionInvocationId,
			user: {
				id: user.id,
				email_address: user.emailAddress,
				password_hash: encoding.encodeBase64(user.passwordHash),
				password_hash_algorithm_id: user.passwordHashAlgorithmId,
				password_salt: encoding.encodeBase64(user.passwordSalt),
				disabled: user.disabled,
				display_name: user.displayName,
				email_address_counter: user.emailAddressCounter,
				password_hash_counter: user.passwordHashCounter,
				disabled_counter: user.disabledCounter,
				sessions_counter: user.sessionsCounter
			}
		};

		const resultJSON = JSON.stringify(resultJSONObject);
		return resultJSON;
	}

	private async invokeGetUserByEmailAddressAction(argumentsJSONObject: object): Promise<string> {
		if (
			!("email_address" in argumentsJSONObject) ||
			typeof argumentsJSONObject.email_address != "string"
		) {
			throw new Error("Invalid or missing 'email_address' field");
		}
		const emailAddress = argumentsJSONObject.email_address;

		const actionInvocationId = generateActionInvocationId();

		let user: User;
		try {
			user = await this.actions.getUserByEmailAddressAction(actionInvocationId, emailAddress);
		} catch (e) {
			if (e instanceof ActionError) {
				const result = createActionInvocationErrorResultJSON(actionInvocationId, e.errorCode);
				return result;
			}
			throw new Error("Unknown error", {
				cause: e
			});
		}

		const resultJSONObject = {
			ok: true,
			action_invocation_id: actionInvocationId,
			user: {
				id: user.id,
				email_address: user.emailAddress,
				password_hash: encoding.encodeBase64(user.passwordHash),
				password_hash_algorithm_id: user.passwordHashAlgorithmId,
				password_salt: encoding.encodeBase64(user.passwordSalt),
				disabled: user.disabled,
				display_name: user.displayName,
				email_address_counter: user.emailAddressCounter,
				password_hash_counter: user.passwordHashCounter,
				disabled_counter: user.disabledCounter,
				sessions_counter: user.sessionsCounter
			}
		};

		const resultJSON = JSON.stringify(resultJSONObject);
		return resultJSON;
	}

	private async invokeUpdateUserEmailAddressAction(argumentsJSONObject: object): Promise<string> {
		if (!("user_id" in argumentsJSONObject) || typeof argumentsJSONObject.user_id != "string") {
			throw new Error("Invalid or missing 'user_id' field");
		}
		const userId = argumentsJSONObject.user_id;

		if (
			!("email_address" in argumentsJSONObject) ||
			typeof argumentsJSONObject.email_address != "string"
		) {
			throw new Error("Invalid or missing 'email_address' field");
		}
		const emailAddress = argumentsJSONObject.email_address;

		if (
			!("user_email_address_counter" in argumentsJSONObject) ||
			typeof argumentsJSONObject.user_email_address_counter != "number" ||
			!Number.isInteger(argumentsJSONObject.user_email_address_counter) ||
			argumentsJSONObject.user_email_address_counter > 2_147_483_647 ||
			argumentsJSONObject.user_email_address_counter < -2_147_483_648
		) {
			throw new Error("Invalid or missing 'user_email_address_counter' field");
		}
		const userEmailAddressCounter = argumentsJSONObject.user_email_address_counter;

		const actionInvocationId = generateActionInvocationId();

		try {
			await this.actions.updateUserEmailAddressAction(
				actionInvocationId,
				userId,
				emailAddress,
				userEmailAddressCounter
			);
		} catch (e) {
			if (e instanceof ActionError) {
				const result = createActionInvocationErrorResultJSON(actionInvocationId, e.errorCode);
				return result;
			}
			throw new Error("Unknown error", {
				cause: e
			});
		}

		const resultJSONObject = {
			ok: true,
			action_invocation_id: actionInvocationId
		};

		const resultJSON = JSON.stringify(resultJSONObject);
		return resultJSON;
	}

	private async invokeUpdateUserPasswordHashAction(argumentsJSONObject: object): Promise<string> {
		if (!("user_id" in argumentsJSONObject) || typeof argumentsJSONObject.user_id != "string") {
			throw new Error("Invalid or missing 'user_id' field");
		}
		const userId = argumentsJSONObject.user_id;

		if (
			!("password_hash" in argumentsJSONObject) ||
			typeof argumentsJSONObject.password_hash != "string"
		) {
			throw new Error("Invalid or missing 'password_hash' field");
		}
		const passwordHash = encoding.decodeBase64(argumentsJSONObject.password_hash);

		if (
			!("password_hash_algorithm_id" in argumentsJSONObject) ||
			typeof argumentsJSONObject.password_hash_algorithm_id != "string"
		) {
			throw new Error("Invalid or missing 'password_hash_algorithm_id' field");
		}
		const passwordHashAlgorithmId = argumentsJSONObject.password_hash_algorithm_id;

		if (
			!("password_salt" in argumentsJSONObject) ||
			typeof argumentsJSONObject.password_salt != "string"
		) {
			throw new Error("Invalid or missing 'password_salt' field");
		}
		const passwordSalt = encoding.decodeBase64(argumentsJSONObject.password_salt);

		if (
			!("user_password_hash_counter" in argumentsJSONObject) ||
			typeof argumentsJSONObject.user_password_hash_counter != "number" ||
			!Number.isInteger(argumentsJSONObject.user_password_hash_counter) ||
			argumentsJSONObject.user_password_hash_counter > 2_147_483_647 ||
			argumentsJSONObject.user_password_hash_counter < -2_147_483_648
		) {
			throw new Error("Invalid or missing 'user_password_hash_counter' field");
		}
		const userEmailAddressCounter = argumentsJSONObject.user_password_hash_counter;

		const actionInvocationId = generateActionInvocationId();

		try {
			await this.actions.updateUserPasswordHashAction(
				actionInvocationId,
				userId,
				passwordHash,
				passwordHashAlgorithmId,
				passwordSalt,
				userEmailAddressCounter
			);
		} catch (e) {
			if (e instanceof ActionError) {
				const result = createActionInvocationErrorResultJSON(actionInvocationId, e.errorCode);
				return result;
			}
			throw new Error("Unknown error", {
				cause: e
			});
		}

		const resultJSONObject = {
			ok: true,
			action_invocation_id: actionInvocationId
		};

		const resultJSON = JSON.stringify(resultJSONObject);
		return resultJSON;
	}

	private async invokeIncrementUserSessionsCounterAction(
		argumentsJSONObject: object
	): Promise<string> {
		if (!("user_id" in argumentsJSONObject) || typeof argumentsJSONObject.user_id != "string") {
			throw new Error("Invalid or missing 'user_id' field");
		}
		const userId = argumentsJSONObject.user_id;

		if (
			!("user_sessions_counter" in argumentsJSONObject) ||
			typeof argumentsJSONObject.user_sessions_counter != "number" ||
			!Number.isInteger(argumentsJSONObject.user_sessions_counter) ||
			argumentsJSONObject.user_sessions_counter > 2_147_483_647 ||
			argumentsJSONObject.user_sessions_counter < -2_147_483_648
		) {
			throw new Error("Invalid or missing 'user_sessions_counter' field");
		}
		const userSessionsCounter = argumentsJSONObject.user_sessions_counter;

		const actionInvocationId = generateActionInvocationId();

		try {
			await this.actions.incrementUserSessionsCounterAction(
				actionInvocationId,
				userId,
				userSessionsCounter
			);
		} catch (e) {
			if (e instanceof ActionError) {
				const result = createActionInvocationErrorResultJSON(actionInvocationId, e.errorCode);
				return result;
			}
			throw new Error("Unknown error", {
				cause: e
			});
		}

		const resultJSONObject = {
			ok: true,
			action_invocation_id: actionInvocationId
		};

		const resultJSON = JSON.stringify(resultJSONObject);
		return resultJSON;
	}

	private async invokeDeleteUserAction(argumentsJSONObject: object): Promise<string> {
		if (!("user_id" in argumentsJSONObject) || typeof argumentsJSONObject.user_id != "string") {
			throw new Error("Invalid or missing 'user_id' field");
		}
		const userId = argumentsJSONObject.user_id;

		const actionInvocationId = generateActionInvocationId();

		try {
			await this.actions.deleteUserAction(actionInvocationId, userId);
		} catch (e) {
			if (e instanceof ActionError) {
				const result = createActionInvocationErrorResultJSON(actionInvocationId, e.errorCode);
				return result;
			}
			throw new Error("Unknown error", {
				cause: e
			});
		}

		const resultJSONObject = {
			ok: true,
			action_invocation_id: actionInvocationId
		};

		const resultJSON = JSON.stringify(resultJSONObject);
		return resultJSON;
	}
}

export interface Actions {
	createUserAction(
		actionInvocationId: string,
		emailAddress: string,
		passwordHash: Uint8Array<any>,
		passwordHashAlgorithmId: string,
		passwordSalt: Uint8Array<any>
	): Promise<User>;
	getUserAction(actionInvocationId: string, userId: string): Promise<User>;
	getUserByEmailAddressAction(actionInvocationId: string, emailAddress: string): Promise<User>;
	updateUserEmailAddressAction(
		actionInvocationId: string,
		userId: string,
		emailAddress: string,
		userEmailAddressCounter: number
	): Promise<void>;
	updateUserPasswordHashAction(
		actionInvocationId: string,
		userId: string,
		passwordHash: Uint8Array<any>,
		passwordHashAlgorithmId: string,
		passwordSalt: Uint8Array<any>,
		userPasswordHashCounter: number
	): Promise<void>;
	incrementUserSessionsCounterAction(
		actionInvocationId: string,
		userId: string,
		userSessionsCounter: number
	): Promise<void>;
	deleteUserAction(actionInvocationId: string, userId: string): Promise<void>;
}

export interface User {
	id: string;
	emailAddress: string;
	passwordHash: Uint8Array<any>;
	passwordHashAlgorithmId: string;
	passwordSalt: Uint8Array<any>;
	disabled: boolean;
	displayName: string;
	emailAddressCounter: number;
	passwordHashCounter: number;
	disabledCounter: number;
	sessionsCounter: number;
}

export class ActionError extends Error {
	public errorCode: string;
	constructor(errorCode: string) {
		super(`User action error ${errorCode}`);

		this.errorCode = errorCode;
	}
}

function createActionInvocationErrorResultJSON(
	actionInvocationId: string,
	errorCode: string
): string {
	const resultJSONObject = {
		ok: false,
		action_invocation_id: actionInvocationId,
		error_code: errorCode
	};

	const resultJSON = JSON.stringify(resultJSONObject);
	return resultJSON;
}

function generateActionInvocationId(): string {
	const alphabet = "abcdefghjkmnopqrstuvwxyz23456789";
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	let id = "";
	for (let i = 0; i < bytes.length; i++) {
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}
