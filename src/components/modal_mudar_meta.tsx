"use client";

import { useEffect, useState } from "react";
import { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";
import { supabase } from "@/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { json } from "node:stream/consumers";

type Meta = {
  materiaFK: number;
  meta_diaria: number;
};

type Materia = {
  materiaPK: number;
  materia_nome: string;
};

export default function MudarMeta({ materiaFK }: { materiaFK: number }) {

  //console.log({materiaFK})
  const [modalAberto, setModalAberto] = useState(false);
  const [novaMeta, setNovaMeta] = useState<number>(0);
  const [metaAtual, setMetaAtual] = useState<number | null>(null);
  const [nomeMateria, setNomeMateria] = useState<string>("");

  useEffect(() => {
    async function fetchdata() {
      //getMeta 
      const {data: meta, error: erro_meta} = await supabase
      .from('dbo_metas')
      .select('meta_diaria')
      .eq('m_materia_foreign_key',materiaFK)
      .single();
      console.log(meta)
      setMetaAtual(meta?.meta_diaria || null)
      
      const {data: materia, error: erro_materia} = await supabase
      .from('dbo_materias')
      .select('materia_nome')
      .eq('id', materiaFK)
      .single();
      console.log(materia)
      setNomeMateria(materia?.materia_nome || "")
    }
    

    if (modalAberto) {
      fetchdata();
    }
  }, [modalAberto, materiaFK]);

  function refreshPage(){
    window.location.reload()
  }

  async function salvarMeta() {
  const { error, data } = await supabase
    .from("dbo_metas")
    .upsert(
      { m_materia_foreign_key: materiaFK, meta_diaria: novaMeta },
      { onConflict: "m_materia_foreign_key" }
    )
    .select();

  if (error) {
    console.error("Erro ao salvar meta:", error.message);
    alert("Erro ao salvar meta: " + error.message);
    return;
  }

  console.log("Meta atualizada com sucesso:", data);
  setMetaAtual(novaMeta);
  setModalAberto(false);
  refreshPage()
  
}
  const metaSemanal = novaMeta * 7;

  return (
    <>
      <button
        onClick={() => setModalAberto(true)}
        className="mt-4 px-6 py-2 bg-[#005791] text-white font-semibold rounded-xl shadow hover:bg-[#003f66] transition"
      >
        Mudar Metas
      </button>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-[#005791] mb-4">Meta de Estudos</h2>
            <p className="mb-2 text-gray-800">
              Matéria: <strong>{nomeMateria}</strong>
            </p>

            <label className="block mb-4 text-[#005791]">
              Nova meta diária (minutos):
              <input
                type="number"
                value={novaMeta}
                onChange={(e) => setNovaMeta(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md text-[#005791]"
              />
            </label>

            {novaMeta > 0 && (
              <p className="mb-4 text-gray-700">
                Meta semanal calculada: <strong>{metaSemanal} minutos</strong>
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={salvarMeta}
                className="px-4 py-2 rounded-md bg-[#005791] text-white hover:bg-[#003f66]"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
