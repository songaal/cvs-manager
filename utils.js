function getContext(contexts, name) {
    for (let i = 0; i < contexts.length; i++) {
        if(contexts[i].name == name) {
            return contexts[i];
        }
    }
}

module.exports = {
    getContext: getContext
}
