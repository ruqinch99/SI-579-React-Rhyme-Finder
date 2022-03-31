import {useState} from 'react';
import SavedWords from "./SavedWords"
import RhymesButton from "./RhymesButton"
import SynonymsButton from "./SynonymsButton"

const Main = () => {

    /**
     * Returns a list of objects grouped by some property. For example:
     * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
     *
     * returns:
     * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
     *    'red': [{name: 'Jack', team: 'red'}]
     * }
     *
     * @param {any[]} objects: An array of objects
     * @param {string|Function} property: A property to group objects by
     * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
     */
    function groupBy(objects, property) {
        // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
        // value for property (obj[property])
        if (typeof property !== 'function') {
            const propName = property;
            property = (obj) => obj[propName];
        }

        const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
        for (const object of objects) {
            const groupName = property(object);
            //Make sure that the group exists
            if (!groupedObjects.has(groupName)) {
                groupedObjects.set(groupName, []);
            }
            groupedObjects.get(groupName).push(object);
        }

        // Create an object with the results. Sort the keys so that they are in a sensible "order"
        const result = {};
        for (const key of Array.from(groupedObjects.keys()).sort()) {
            result[key] = groupedObjects.get(key);
        }
        return result;
    }

    // Initialize DOM elements that will be used.

    const [wordInput, setWordInput] = useState([]);
    const [wordOutput, setWordOutput] = useState([]);
    const [savedWords, setSavedWords] = useState([]);

    /**
     * Makes a request to Datamuse and updates the page with the
     * results.
     *
     * Use the getDatamuseRhymeUrl()/getDatamuseSimilarToUrl() functions to make
     * calling a given endpoint easier:
     * - RHYME: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
     * - SIMILAR TO: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
     *
     * @param {String} url
     *   The URL being fetched.
     * @param {Function} callback
     *   A function that updates the page.
     */
    const datamuseRequest = (url, callback) => {
        setWordOutput (()=>{return <p>...loading</p>});
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // This invokes the callback that updates the page.
                callback(data);
            }, (err) => {
                console.error(err);
            });
    };

    /**
     * Gets a URL to fetch rhymes from Datamuse
     *
     * @param {string} rel_rhy
     *   The word to be rhymed with.
     *
     * @returns {string}
     *   The Datamuse request URL.
     */
    function getDatamuseRhymeUrl(rel_rhy) {
        return `https://api.datamuse.com/words?${(new URLSearchParams({ 'rel_rhy': wordInput })).toString()}`;
    }

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
        return `https://api.datamuse.com/words?${(new URLSearchParams({ 'ml': wordInput.value })).toString()}`;
    }

    /**
     * Add a word to the saved words array and update the #saved_words `<span>`.
     *
     * @param {string} word
     *   The word to add.
     */
    function addToSavedWords(word) {
        setSavedWords((list) => {
            return [...list, word]
        })
    }

    function wordsList(item) {
        // You'll need to finish this...
        const wordsList = item.map((words) => {
            return <li > {words.word} < button onClick = {() => addToSavedWords(words.word)} type = "button" className = "btn btn-secondary" > (save) < /button> </li >
        });
        return wordsList;
    }

    const rhymeWords = (result) => {
        const output = []
        if (result.length !== 0) {
            const groupOutput = groupBy(result, "numSyllables");
            output.push( < h2 > Words that rhyme with {wordInput}: < /h2>)
            Object.entries(groupOutput).map(([numSyllables, items]) => {
                output.push( < div > < h3 > Syllables: {numSyllables} < /h3> < ul > {wordsList(items)} < /ul> < /div>)
            })
        }
        else {
            output.push( < p > (no results) < /p>)
        }
        setWordOutput(output);
    };

    return (
        <>
            <div className="row">
                <SavedWords savedWords={savedWords}/>
            </div>
            <div className="row">
                <div className="input-group col">
                    <input className="form-control" id="word_input" placeholder="Enter a word" type="text"
                           onChange={(e)=>{setWordInput(e.target.value)}}
                           onKeyDown={(e) => {
                               if(e.keyCode === 13){
                                   datamuseRequest(getDatamuseRhymeUrl(wordInput),rhymeWords);
                               }}}
                    />
                    <RhymesButton
                        wordInput={wordInput}
                        rhymeWords={rhymeWords}
                        datamuseRequest={datamuseRequest}
                        getDatamuseRhymeUrl={getDatamuseRhymeUrl}
                    />
                    <SynonymsButton
                        wordInput={wordInput}
                        datamuseRequest={datamuseRequest}
                        wordsList={wordsList}
                        setWordOutput={setWordOutput}
                    />
                </div>
            </div>
            <div className="row">
                <h2 className="col" id="output_description"></h2>
            </div>
            <div className="output row">
                <output className="col" id="word_output">{wordOutput}</output>
            </div>
        </>
    )
}

export default Main;