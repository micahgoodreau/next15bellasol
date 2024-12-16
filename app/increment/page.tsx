"use client"

import { incrementNumberAction } from "../actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";

export default function IncrementExample() {
    const [counter, setCounter] = useState(0);
    const { isPending, execute, data } = useServerAction(incrementNumberAction);
    return (
        <>

                <Button
                    disabled={isPending} 
                    onClick={async () => {
                        const [data, err] = await execute({ 
                            number: counter, 
                        }) 


                        if (err) {
                            // handle error
                            return
                        }

                        setCounter(data);
                    }}
                >
                    Invoke action
                </Button>
                <p>Count:</p>
                <div>{isPending ? "saving..." : data}</div>
</>
    );
}