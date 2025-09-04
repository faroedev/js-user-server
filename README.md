# @faroe/user-server

Package for building Faroe user servers.

## Overview

## Installation

```
npm install @faroe/user-server
```

## API reference

### Actions

```ts
export interface Actions {
	// create_user action where the action parameters are mapped as:
	// - action_invocation_id: actionInvocationId
	// - email_address: emailAddress
	// - password_hash: passwordHash
	// - password_hash_algorithm_id: passwordHashAlgorithmId
	// - password_salt: passwordSalt
	// Can throw an ActionError with the action error code.
	// No other error types are thrown.
	createUserAction(
		actionInvocationId: string,
		emailAddress: string,
		passwordHash: Uint8Array<any>,
		passwordHashAlgorithmId: string,
		passwordSalt: Uint8Array<any>
	): Promise<User>;

	// get_user action where the action parameters are mapped as:
	// - action_invocation_id: actionInvocationId
	// - user_id: userId
	// Can throw an ActionError with the action error code.
	// No other error types are thrown.
	getUserAction(actionInvocationId: string, userId: string): Promise<User>;

	// get_user_by_email_address action where the action parameters are mapped as:
	// - action_invocation_id: actionInvocationId
	// - user_id: userId
	// Can throw an ActionError with the action error code.
	// No other error types are thrown.
	getUserByEmailAddressAction(actionInvocationId: string, emailAddress: string): Promise<User>;

	// update_user_email_address action where the action parameters are mapped as:
	// - action_invocation_id: actionInvocationId
	// - user_id: userId
	// - email_address: emailAddress
	// - user_email_address_counter: userEmailAddressCounter
	// Can throw an ActionError with the action error code.
	// No other error types are thrown.
	updateUserEmailAddressAction(
		actionInvocationId: string,
		userId: string,
		emailAddress: string,
		userEmailAddressCounter: number
	): Promise<void>;

	// update_user_password_hash action where the action parameters are mapped as:
	// - action_invocation_id: actionInvocationId
	// - user_id: userId
	// - password_hash: passwordHash
	// - password_hash_algorithm_id: passwordHashAlgorithmId
	// - password_salt: passwordSalt
	// - user_password_hash_counter: userPasswordHashCounter
	// Can throw an ActionError with the action error code.
	// No other error types are thrown.
	updateUserPasswordHashAction(
		actionInvocationId: string,
		userId: string,
		passwordHash: Uint8Array<any>,
		passwordHashAlgorithmId: string,
		passwordSalt: Uint8Array<any>,
		userPasswordHashCounter: number
	): Promise<void>;

	// increment_user_sessions_counter action where the action parameters are mapped as:
	// - action_invocation_id: actionInvocationId
	// - user_id: userId
	// - user_sessions_counter: userSessionsCounter
	// Can throw an ActionError with the action error code.
	// No other error types are thrown.
	incrementUserSessionsCounterAction(
		actionInvocationId: string,
		userId: string,
		userSessionsCounter: number
	): Promise<void>;

	// delete_user action where the action parameters are mapped as:
	// - action_invocation_id: actionInvocationId
	// - user_id: userId
	// Can throw an ActionError with the action error code.
	// No other error types are thrown.
	deleteUserAction(actionInvocationId: string, userId: string): Promise<void>;
}
```

### Server

```ts
function constructor(actions: Actions);
```

The `resolveActionInvocationEndpointRequest()` method takes an action invocation endpoint request body and returns a response body for a 200 response. It will throw an `Error` if the request is invalid.

```ts
async function resolveActionInvocationEndpointRequest(body: string): Promise<string>;
```

### ActionError

Extends `Error`. Represents an action error.

```ts
export class ActionError extends Error {
	// Actin error code.
	public errorCode: string;
}
```
