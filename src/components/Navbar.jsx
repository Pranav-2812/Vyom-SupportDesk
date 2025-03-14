export default function Navbar(){
    return (
        <div className="flex flex-row-full h-28 justify-between bottom-shadow px-10  bg-white">
            <div className="flex flex-row items-center w-1/4 justify-between pr-14">
                <img src="/logo.png"/>
                <h1 className="text-4xl text-blue-500 font-bold">Support Desk</h1>
            </div>
            <div>
                <img src="/bank.png"/>
            </div>
        </div>
    )
}
