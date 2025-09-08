import {Env} from "@/config/env.ts";
import {type FC, type PropsWithChildren, useEffect, useState} from "react";
import {seedLocalDbFromMocks} from "@/infrastructure/localDb/seeder.ts";
import {db} from "@/infrastructure/localDb/db.ts";

const SEED_VERSION = 'v1';

const needsReseed = (): boolean => {
    if (!Env.useLocalDb) return false;
    const stored = localStorage.getItem('local_seed_version');
    return stored !== SEED_VERSION;
}

export const LocalDbGate: FC<PropsWithChildren> = ({ children }) => {
    const [ready, setReady] = useState(!Env.useLocalDb);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!Env.useLocalDb) return;
            try {
                await db.open();
                const count = await db.users.count();
                if (count === 0 || needsReseed()) {
                    await seedLocalDbFromMocks();
                    localStorage.setItem('local_seed_version', SEED_VERSION);
                }
                if (!cancelled) setReady(true);
            } catch (e) {
                console.error('Failure on starting local DB', e);
                if (!cancelled) setReady(true);
            }
        })();
        return () => {
            cancelled = true;
        }
    }, []);

    if (!ready) {
        return <div>Carregando dados locais...</div>
    }

    return <>{children}</>
}

