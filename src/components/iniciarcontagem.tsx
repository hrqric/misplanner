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

        return(
            <><button onClick={() => setModalAberto(true)} className="mt-4 px-6 py-2 bg-[#005791] text-white font-semibold rounded-xl shadow hover:bg-[#003f66] transition"></button>
            </>
        )
    }


