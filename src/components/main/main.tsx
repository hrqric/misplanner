import React, { FC } from 'react';


interface mainProps {}

const main: FC<mainProps> = () => (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <header className="bg-[#005791] text-[#f3f4f7] p-8 text-left h-100 flex items-center justify-between">
        <div>
            <h1 className="text-4xl font-bold mb-2 pl-24">Mi's Planner</h1>
            <p className="text-lg pl-25">O melhor jeito de gerenciar seu tempo de estudos!</p>
            <button className="mt-4 px-6 py-2 bg-[#f3f4f7] text-[#005791] font-semibold rounded-[7px] shadow hover:bg-[#d9d9d9] transition cursor-pointer ml-24">
              Entrar
            </button>
        </div>
        <img src='/landimage.png' alt="" className="w-100 h-100 mb-4 rounded-full"/>
        <div></div>
      </header>
    </div>
);

export default main;
