import profilePic from './assets/Happy 3.jpeg' 

function Card(){
    return(
        <div className="card">
            <img className="card-image" src={profilePic} alt="profile picture"></img>
            <h2 className='card-title'>YH</h2>
            <p className='card-text'>I Study React</p>
        </div>
    );
}


export default Card