import Link from "next/link";
import MudarMeta from "@/components/modal_mudar_meta";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

type infos = {
    materiaAtual: string

}



export default function Dashboard({materiaAtual, meta, meta_sema, tempoHoje, progresso}: {materiaAtual: string, meta: number, meta_sema: number, tempoHoje: number, progresso: number}){
  const [materiaID, setMateriaId] = useState<number>(0);

  useEffect(() => {
    async function fetchID(){
      const {data: materia, error: erro_materia_id} = await supabase
      .from('dbo_materias')
      .select('id')
      .eq('materia_nome', materiaAtual)
      .single()
      console.log(materia?.id)
      setMateriaId(materia?.id)
    }

  fetchID()
  })

  return(
        <div className="min-h-screen bg-[#FFFAFF] p-[40]">
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
            <p className="text-3xl font-bold mt-4 text-gray-800">{meta_sema}</p>
            <p className="text-sm text-gray-600 mt-2">Falta 40% para a meta semanal ser alcançada</p>
          </div>

                    {/* Tempo estudado hoje */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#256D1B]">Tempo estudado hoje</h2>
            <p className="text-3xl font-bold mt-4 text-gray-800">{tempoHoje}</p>
            <p className="text-sm text-gray-500 mt-1">Boa consistência! 🎉</p>
          </div>

                              {/* Tempo estudado hoje */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-[#256D1B]">Tempo estudado na semana</h2>
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

            <MudarMeta materiaFK={materiaID}>

            </MudarMeta>

            <button className="px-6 py-3 bg-[#D62246] text-white font-semibold rounded-xl shadow hover:bg-[#89031E] transition cursor-pointer ml-[45]">
              Parar estudo
            </button>

        </section>
        </div>
    )
}