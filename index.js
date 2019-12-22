'use strict';

module.exports = schema => {
	const {
		toJSON,
		normalizeId,
		removeVersion,
		removePrivatePaths,
		toJSON: {transform} = {}
	} = schema.options;

	const json = {
		transform(doc, ret, options) {
			if (!removePrivatePaths) {
				const {paths} = schema;

				for (const path in paths) {
					if (paths[path].options && paths[path].options.private) {
						if (ret[path]) {
							delete ret[path];
						}
					}
				}
			}

			if (!removeVersion) {
				const {__v} = ret;

				if (!__v) {
					delete ret.__v;
				}
			}

			if (!normalizeId) {
				const {_id, id} = ret;

				if (_id && !id) {
					ret.id = _id.toString();
					delete ret._id;
				}
			}

			if (transform) {
				return transform(doc, ret, options);
			}
		}
	};

	schema.options.toJSON = {...toJSON, ...json};
};
