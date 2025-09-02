import React from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Box, Button, TextField } from '@mui/material';
import type {ILoginCredentials} from "@/api/models/Auth.interface.ts";

type Props = {
    onSubmit: (credentials: ILoginCredentials) => void;
    loading: boolean;
    error?: string | null;
};

export default function LoginForm({ onSubmit, loading, error }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isDirty }
    } = useForm<ILoginCredentials>({
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const submit = (data: ILoginCredentials) => onSubmit(data);

    return (
        <Box component="form" onSubmit={handleSubmit(submit)} noValidate sx={{ display: "grid", gap: 2 }}>
            {!!error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Email"
                type="email"
                autoComplete="email"
                disabled={loading || isSubmitting}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                    required: 'Este campo é obrigatório',
                    validate: (v) => (/^\S+@\S+\.\S+$/.test(v) ? true : 'Email inválido'),
                })}
            />

            <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                disabled={loading || isSubmitting}
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                    required: 'Este campo é obrigatório',
                    minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' },
                })}
            />

            <Button
                type="submit"
                variant="contained"
                disabled={loading || isSubmitting || !isDirty || !isValid}
            >
                {loading || isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

        </Box>
    )
}
