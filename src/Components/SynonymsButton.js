const SynonymsButton = (props) => {
    const {
        datamuseRequest,
        wordInput,
        wordsList,
        setWordOutput,
    } = props;

    /**
     * Gets a URL to fetch 'similar to' from Datamuse.
     *
     * @param {string} ml
     *   The word to find similar words for.
     *
     * @returns {string}
     *   The Datamuse request URL.
     */
    function getDatamuseSimilarToUrl(ml) {
        return `https://api.datamuse.com/words?${(new URLSearchParams({ 'ml': wordInput })).toString()}`
    }

    function showSynonyms(result) {
        const output = [];
        if (result.length !== 0) {
            output.push( < h2 key = "titleSyn" > Words with a similar meaning to {wordInput}: < /h2>)
            output.push( < ul key = 'ul' > {
                wordsList(result)
            } < /ul>);
        }
        else {
            output.push( < p > no result < /p>);
        }
        setWordOutput(output);
    }

    const synonyms = () => {
        datamuseRequest(getDatamuseSimilarToUrl(wordInput), showSynonyms)
    }

    return ( < button onClick = {synonyms} type = "button" className = "btn btn-secondary" > Show synonyms < /button>)
}

export default SynonymsButton;