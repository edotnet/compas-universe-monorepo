export function serializeMap(data: any) {
    const mapToObj = m => {
        return Array.from(m).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    };
    if (data instanceof Map) {
        return mapToObj(data);
    }
    for (const key in data) {
        const value = data[key];
        if (value instanceof Map) {
            data[key] = mapToObj(data[key]);
        }
    }
    return data;
}
