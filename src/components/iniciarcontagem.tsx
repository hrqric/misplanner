"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

export default function IniciarEstudo() {
    const [modal_iniciarAberto, setModalAberto] = useState(false)
    const [estudo_em_andamento, setEstudoEmAndamento] = useState(false)
    const [nomeMateria, setNomeMateria] = useState<string>("")
    const [estudoID, setEstudoID] = useState<number>(0)

    useEffect(() => {
        async function fetchmaterias(){
            const {data: materias, error: erro_materia} = await supabase
            .from('dbo_materias')
            .select('materia_nome, id')
            console.log(materias)
        }

        })

        async function iniciar_apontamento(){
            console.log(nomeMateria)
        }

        return(
            <><button onClick={() => setModalAberto(true)} className="mt-4 px-6 py-2 bg-[#005791] text-white font-semibold rounded-xl shadow hover:bg-[#003f66] transition"></button>

      {modal_iniciarAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-[#005791] mb-4">Meta de Estudos</h2>
            <p className="mb-2 text-gray-800">
              Matéria: <strong>{nomeMateria}</strong>
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={iniciar_apontamento()}
                className="px-4 py-2 rounded-md bg-[#005791] text-white hover:bg-[#003f66]"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

           
        )
    } </>)}




