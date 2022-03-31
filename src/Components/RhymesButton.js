const RhymesButton = (props) => {

    const {
        datamuseRequest,
        getDatamuseRhymeUrl,
        rhymeWords,
        wordInput
    } = props;

    return ( < button type = "button"
                      className = "btn btn-primary"
                      onClick = {
                          () => datamuseRequest(getDatamuseRhymeUrl(wordInput), rhymeWords)
                      } > Show rhyming words < /button>)
};

export default RhymesButton;