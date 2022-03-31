const SavedWords = (props) => {
    if (props.savedWords.length) {
        return ( < div className = "col" > Saved words: < span id = "saved_words" > {props.savedWords.join(', ')} < /span></div > );
    } else {
        return ( < div className = "col" > Saved words: < span id = "saved_words" > (none) < /span></div > );
    }
}

export default SavedWords;