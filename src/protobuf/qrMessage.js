export default {
    nested: {
        qrpackage: {
            nested: {
                QrMessage: {
                    fields: {
                        version: {
                            rule: "required",
                            type: "int32",
                            id: 1
                        },
                        publicKey: {
                            rule: "required",
                            type: "bytes",
                            id: 2
                        },
                        name: {
                            rule: "required",
                            type: "string",
                            id: 3
                        },
                        location: {
                            rule: "required",
                            type: "string",
                            id: 4
                        },
                        notificationKey: {
                            rule: "required",
                            type: "bytes",
                            id: 5
                        },
                        venueType: {
                            rule: "required",
                            type: "string",
                            id: 6
                        },
                        signature: {
                            rule: "required",
                            type: "bytes",
                            id: 7
                        }
                    }
                }
            }
        }
    }
}