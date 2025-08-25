import { useHookState } from "../topo";
import { useChange } from "./use-change";

interface Storage<T> {
	status: Promise.Status;
	value: T;
	promise: Promise<T>;
}
export function useAsync<T>(
	callback: () => Promise<T>,
	dependencies: unknown[],
	discriminator?: unknown,
): [Promise.Status, T | undefined] {
	const storage = useHookState<Storage<T>>(discriminator, (state) => {
		state.promise?.cancel();
		return false;
	});

	if (useChange(dependencies, storage)) {
		storage.promise?.cancel();
		storage.promise = callback();

		storage.promise
			.then(
				(value) => {
					storage.value = value;
				},
				(err) => {
					storage.value = err;
				},
			)
			.finally(() => {
				storage.status = storage.promise!.getStatus();
			});
	}

	return [storage.status, storage.value];
}
