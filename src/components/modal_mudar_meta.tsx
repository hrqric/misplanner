"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useUser } from "@clerk/nextjs";

type Meta = {
  materiaFK: number;
  meta_diaria: number;
};

type Materia = {
  materiaPK: number;
  materia_nome: string;
};

export default function MudarMeta({ materiaFK }: { materiaFK: number }) {

  console.log({materiaFK})
  const [modalAberto, setModalAberto] = useState(false);
  const [novaMeta, setNovaMeta] = useState<number>(0);
  const [metaAtual, setMetaAtual] = useState<number | null>(null);
  const [nomeMateria, setNomeMateria] = useState<string>("");

  useEffect(() => {
    async function fetchMeta() {
      // Pega a meta atual
      const { data: metaData } = await supabase
        .from("dbo_metas")
        .select("meta_diaria")
        .eq("m_materia_foreign_key", materiaFK)
        .single();
      setMetaAtual(metaData?.meta_diaria || null);

      // Nome da matéria
      const { data: materia } = await supabase
        .from("dbo_materias")
        .select("materia_nome")
        .eq("id", materiaFK)
        .single();
      setNomeMateria(materia?.materia_nome || "");
    }

    if (modalAberto) {
      fetchMeta();
    }
  }, [modalAberto, materiaFK]);

  async function salvarMeta() {
    await supabase
      .from("dbo_metas")
      .upsert({ materiaFK, meta_diaria: novaMeta }, { onConflict: "m_materia_foreign_key" });

    setMetaAtual(novaMeta);
    setModalAberto(false);
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
