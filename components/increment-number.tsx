"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { incrementNumberAction } from "@/app/actions";

export default function IncrementNumber() {
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
                <div>Count:</div>
                <div>{isPending ? "saving..." : data}</div>
</>
    );
}