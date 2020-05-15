import { IDictionary, ThingOrThingGetter } from "./wa-contracts";

export class Util {
    static getDictValue = <T>(obj: IDictionary<T>, key: string): T => {
        // Check for composite key { 'a.b.c': 'foo'}
        if (key in obj) {
            return obj[key];
        }
        // Split keys and resolve nested { a: { b: { c: 'foo'}}}
        const value = key.split('.').reduce((obj, part) => obj[part] || {}, obj as any);
        return value instanceof Object && Object.keys(value).length === 0 ? undefined : value;
    }

    static resolveObjectValue<T, T2>(key: string, obj: ThingOrThingGetter<T2>): T {
        // Recursively resolve
        const value = obj instanceof Function
            ? Util.resolveObjectValue(key, obj.apply(obj, [key]))
            : obj instanceof Object
                ? Util.getDictValue<T>(obj as IDictionary<T>, key)
                : obj; // Plain

        // Dict value might be a function
        return value instanceof Function
            ? Util.resolveObjectValue(key, value.apply(value, [key]))
            : value as T;
    }

    static resolveOperatorValue<T>(value: ThingOrThingGetter<T>): T {
        // Recursively resolve
        return value instanceof Function
            ? Util.resolveOperatorValue(value.apply(value))
            : value;
    }

    static classOf<T>(o: T): any {
        return o.constructor;
    }
}
