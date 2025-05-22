"use client";

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"

import Header from "./header";
import Dashboard from "@/components/dashboardmain";

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
  const [materiaAtual, setMateriaAtual] = useState<string | "">("");
  const [meta, setMeta] = useState<number | 0>(0);
  const [meta_sema, setMetaSemanal] = useState<number | 0>(0);
  const [materiaAtualID, setMateriaAtualId] = useState<number | null>(null);
  
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
      const {data: materia, error: materia_error} = await supabase
      .from('dbo_materias')
      .select('materia_nome, id')
      .eq('focus', 1)
      .single();
      setMateriaAtual(materia?.materia_nome || "")
      setMateriaAtualId(materia?.id || null)

      //4. Buscar a meta do foco
      const {data: meta_materia, error: meta_error} = await supabase
      .from('dbo_metas')
      .select('meta_diaria')
      .eq('m_materia_foreign_key', materia?.id)
      .single()
      setMeta(meta_materia?.meta_diaria || null)

     //5. Setar meta semanal
     const meta_semanal = meta_materia?.meta_diaria*7 
     setMetaSemanal(meta_semanal)
    }


    fetchDados();
  }, []);

  const progresso = (meta ? Math.min((tempoHoje / meta) * 100, 100) : 0) || 1;


  return (  
    <div className="min-h-screen bg-[#FFFAFF] ">
      {/* Usuário autenticado */}
      <SignedIn>
        <Header></Header>
      <div className="mt-10 ml-12">
          <h1 className="text-4xl font-bold text-[#256D1B]">Olá, {user?.firstName || "estudante"} 👋</h1>
          <p className="text-lg text-[#191102] mt-2">Aqui está seu resumo de estudos:</p>
      </div>
        <Dashboard materiaAtual={materiaAtual} meta={meta} meta_sema={meta_sema} tempoHoje={tempoHoje} progresso={progresso}></Dashboard>

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
