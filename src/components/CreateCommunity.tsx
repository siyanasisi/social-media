export const CreateCommunity = () => {
    return (
        <form>
            <h2> create new community </h2>
            <div>
                <label> community name </label>
                <input type="text" id="name" required/>
            </div>
            <div>
                <label> description </label>
                <textarea id="description" required rows={3}/>
            </div>
            <button> create community </button>
        </form>
    );
};