"use client";

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"

import MudarMeta from "@/components/modal_mudar_meta";

dayjs.extend(duration);

type Apontamento = { 
    a_materia_foreign_key: number;
    apont_hora_inicio: string;
    apont_hora_fim: string;
    apont_ativo: boolean;
};

type Materia = {
    id: number;
    materia_nome: string;

};

type Meta = {
    m_materia_foreign_key: number;
    meta_diaria: number;
};

export default function DashboardPage() {
  const { user } = useUser();
  const [tempoHoje, setTempoHoje] = useState(0);
  const [materiaAtual, setMateriaAtual] = useState<string | null>(null);
  const [meta, setMeta] = useState<number | null>(null);

   useEffect(() => {
    async function fetchDados() {
      const hoje = dayjs().format("YYYY-MM-DD");

      // 1. Apontamentos de hoje
      const { data: apontamentos } = await supabase
        .from("dbo_apontamento_estudos")
        .select("*")
        .gte("created_at", `${hoje} 00:00:00`)
        .lte("created_at", `${hoje} 23:59:59`);

      // 2. Calcular tempo total
      const totalMinutos = (apontamentos || []).reduce((acc, apont) => {
        if (apont.apont_hora_fim) {
          const ini = dayjs(apont.apont_hora_inicio);
          const fim = dayjs(apont.apont_hora_fim);
          const diff = fim.diff(ini, "minute");
          return acc + diff;
        }
        return acc;
      }, 0);
      setTempoHoje(totalMinutos);

      // 3. Buscar matéria em foco (última ativa)
      const ultima = (apontamentos || [])
        .filter(a => a.apont_ativo)
        .sort((a, b) => (dayjs(b.apont_hora_inicio).unix() - dayjs(a.apont_hora_inicio).unix()))[0];

      if (ultima) {
        const { data: materia } = await supabase
          .from("dbo_materias")
          .select("materia_nome")
          .eq("id", ultima.a_materia_foreign_key)
          .single();
        setMateriaAtual(materia?.materia_nome || null);

        // 4. Buscar meta dessa matéria
        const { data: metaData } = await supabase
          .from("dbo_metas")
          .select("meta_diaria")
          .eq("materiaFK", ultima.materiaFK)
          .single();
        setMeta(metaData?.meta_diaria || null);
      }
    }

    fetchDados();
  }, []);

  const progresso = meta ? Math.min((tempoHoje / meta) * 100, 100) : 0;


  return (
    <div className="min-h-screen bg-[#FFFAFF] p-[40]">
      {/* Usuário autenticado */}
      <SignedIn>
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-[#256D1B]">Olá, {user?.firstName || "estudante"} 👋</h1>
          <p className="text-lg text-[#191102] mt-2">Aqui está seu resumo de estudos:</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Matéria em foco */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#256D1B]">Matéria em foco</h2>
            <p className="text-2xl font-bold mt-4 text-gray-800">{materiaAtual || "Nenhuma ativa no momento"}</p>
            <p className="text-sm text-gray-500 mt-1">Estude mais 30min para bater sua meta de hoje.</p>
          </div>



          {/* meta diária */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#256D1B]">Meta diária</h2>
            <p className="text-3xl font-bold mt-4 text-gray-800">{meta}</p>
            <p className="text-sm text-gray-500 mt-1">Bons estudos! 🎉</p>
          </div>

          {/* meta semanal */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#256D1B]">Meta semanal</h2>
            <p className="text-3xl font-bold mt-4 text-gray-800">{meta} * 7</p>
            <p className="text-sm text-gray-600 mt-2">Falta 40% para a meta semanal ser alcançada</p>
          </div>

                    {/* Tempo estudado hoje */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#256D1B]">Tempo estudado hoje</h2>
            <p className="text-3xl font-bold mt-4 text-gray-800">{tempoHoje}</p>
            <p className="text-sm text-gray-500 mt-1">Boa consistência! 🎉</p>
          </div>

          {/* Progresso da semana */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#256D1B]">Progresso da semana</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div className="bg-[#256D1B] h-4 rounded-full" style={{ width: `${progresso}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">60% da meta semanal alcançada</p>
          </div>

        </main>

        {/* Ações */}
        <section className="mt-12">
          <Link href="/estudos">
            <button className="px-6 py-3 bg-[#256D1B] text-white font-semibold rounded-xl shadow hover:bg-[#3FD62B] transition cursor-pointer mr-[45]">
              Iniciar estudo agora
            </button>
          </Link>

            {/* <button className="px-6 py-3 bg-[#256D1B] text-white font-semibold rounded-xl shadow hover:bg-[#3FD62B] transition cursor-pointer">
              Mudar metas
            </button> */}

            <MudarMeta materiaFK={1}>

            </MudarMeta>

            <button className="px-6 py-3 bg-[#D62246] text-white font-semibold rounded-xl shadow hover:bg-[#89031E] transition cursor-pointer ml-[45]">
              Parar estudo
            </button>

        </section>
      </SignedIn>

      {/* Usuário não autenticado */}
      <SignedOut>
        <div className="text-center mt-20">
          <h2 className="text-2xl text-[#256D1B] font-semibold">Você precisa estar logado para acessar o painel.</h2>
          <SignInButton mode="modal">
            <button className="mt-4 px-6 py-2 bg-[#256D1B] text-white font-semibold rounded-xl shadow hover:bg-[#003f66] transition">
              Fazer login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
