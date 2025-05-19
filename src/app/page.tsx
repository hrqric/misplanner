"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  SignInButton,
  ClerkLoaded,
  ClerkLoading,
  SignUpButton,
  SignedIn,
  SignedOut
} from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirecionar para a tela principal após login
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard"); // Altere para a rota desejada
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <header className="bg-[#69DC9E] text-[#f3f4f7] p-8 text-left h-100 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 pl-24">Mi's Planner</h1>
          <p className="text-lg pl-25">O melhor jeito de gerenciar seu tempo de estudos!</p>
          <SignInButton mode="modal">
            <button className="mt-4 px-6 py-2 bg-[#f3f4f7] text-[#69DC9E] font-semibold rounded-[7px] shadow hover:bg-[#d9d9d9] transition cursor-pointer ml-24">
              Entrar
            </button>
          </SignInButton>
        </div>
        <img src="/landimage.png" alt="" className="w-100 h-100 mb-4 rounded-full" />
        <div></div>
      </header>

      {/* Features Section */}
      <section className="p-10 grid md:grid-cols-3 gap-6 h-130">
        <div className="bg-gray-100 rounded-2xl p-6 shadow">
          <h2 className="text-[35px] font-semibold mb-2 text-[#69DC9E]">Gestão inteligente do tempo</h2>
          <p className="text-[21px] text-gray-700">Organize seus estudos de forma prática e eficiente, com total controle sobre o seu tempo.</p>
        </div>

        <div className="bg-gray-100 rounded-2xl p-6 shadow">
          <h2 className="text-[35px] font-semibold mb-2 text-[#69DC9E]">Estudo com foco e metas</h2>
          <p className="text-[21px] text-gray-700">Estabeleça metas diárias e acompanhe seu progresso para estudar com mais foco e disciplina.</p>
        </div>

        <div className="bg-gray-100 rounded-2xl p-6 shadow">
          <h2 className="text-[35px] font-semibold mb-2 text-[#69DC9E]">Ajuda instantânea com IA</h2>
          <p className="text-[21px] text-gray-700">Tire dúvidas em tempo real com a integração do ChatGPT, diretamente durante seus estudos.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#69DC9E] text-[#f3f4f7] text-center p-4">
        <p>&copy; 2025 Mi's Planner. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
