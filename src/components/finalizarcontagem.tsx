"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

export default function FinalizarEstudo() {
    const [estudo_em_andamento, setEstudoEmAndamento] = useState(false)
    const [apontamento_ativo, setApontamentoAtivo] = useState<string>('')

    useEffect(() => {


        async function fetchapont(){
            const {data: apontamento_ativo, error: erro_apontamento} = await supabase
            .from('dbo_apontamento_estudos')
            .select('')
            .eq('apont_ativo',1)
            .single
            console.log(apontamento_ativo)
            setApontamentoAtivo(apontamento_ativo?.id)

        }

        if(apontamento_ativo)
            {
                setEstudoEmAndamento(true)
            }
        else{
            fetchapont()
        }

        })

        async function setFinalEstudo(){
            const {error, data} = await supabase
            .from('dbo_apontamento_estudos')
            .upsert({id: apontamento_ativo, apont_ativo: 0, apont_hora_fim: Date.now()}, {onConflict: 'id'})
        }

        return(
            <>
            {estudo_em_andamento && (
                <button onClick={() => setFinalEstudo()} className="mt-4 px-6 py-2 bg-[#005791] text-white font-semibold rounded-xl shadow hover:bg-[#003f66] transition"></button>
            )}
            
            </>
        )
    }


