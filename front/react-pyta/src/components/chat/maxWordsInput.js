import  { useState,useEffect } from 'react';

const MaxWordsInput = ({ maxWords,  onSubmit }) => {
    const [maxWordsInput, setMaxWordsInput] = useState(maxWords);
    const [notSaved, setNotSaved] = useState(false);

    useEffect(() => {
        if (maxWordsInput !== maxWords){
            setNotSaved(true);
        }else{
            setNotSaved(false);
        }
    }, [maxWordsInput,maxWords]);
    return (
        <form key={1} onSubmit={(e)=>{
            e.preventDefault();
            window.document.body.style.zoom = 1;
            onSubmit(e.target.maxWords.value)
            }}>
        <input className={notSaved ? "danger": ""} key={1} name="maxWords" type="number" defaultValue={maxWords} onChange={(e)=> setMaxWordsInput(e.target.value)}  min={100} max={3000} step={50}></input>
        </form>
    );
};

export default MaxWordsInput;