import {Alert, Box, Button, FormControlLabel, Switch, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import type {TFormMode} from "@app/contexts/forms/types.ts";
import type {IUser} from "@/api/models/Users.interface.ts";

export type UserFormValues = {
    username: string;
    email: string;
    password?: string;
    isActive: boolean;
};

export type UserFormProps = {
    mode: TFormMode;
    defaultValues?: Partial<UserFormValues>;
    loading?: boolean;
    error?: string | null;
    onSubmit: (values: UserFormValues) => void | Promise<void>;
    submitLabel?: string;
}

export default function UsersForm(props: UserFormProps) {
    const {
        mode,
        defaultValues,
        loading = false,
        error = null,
        onSubmit,
        submitLabel = 'Salvar',
    } = props;

    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty, isValid },
        watch,
    } = useForm<UserFormValues & { password_confirmation?: string }>({
        mode: 'onChange',
        defaultValues: {
            username: defaultValues?.username || '',
            email: defaultValues?.email || '',
            isActive: defaultValues?.isActive || true,
            ...defaultValues,
        },
    });

    const password = watch('password');

    const submit = (data: IUser & {password_confirmation?: string} ) => {
        const payload: IUser = {
            ...data,
            ...(isCreate ? { password: data.password } : {}),
        };
        return onSubmit(payload);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(submit)} noValidate sx={{ display: "grid", gap: 2, width: 480 }}>
            {!!error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Nome"
                disabled={loading || isSubmitting || isView}
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register("username", {
                    required: "Este campo é obrigatório",
                    minLength: { value: 2, message: "Mínimo de 2 caracteres" },
                })}
            />

            <TextField
                label="Email"
                type="email"
                disabled={loading || isSubmitting || isView}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", {
                    required: "Este campo é obrigatório",
                    validate: (v) => (/^\S+@\S+\.\S+$/.test(v) ? true : "Email inválido"),
                })}
            />

            { isCreate &&
                <>
                    <TextField
                        label="Senha"
                        type="password"
                        disabled={loading || isSubmitting}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register("password", {
                            required: "Este campo é obrigatório",
                            minLength: { value: 6, message: "Mínimo de 6 caracteres" },
                        })}
                    />

                    <TextField
                        label="Confirmação de Senha"
                        type="password"
                        disabled={loading || isSubmitting}
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation?.message}
                        {...register("password_confirmation", {
                            required: "Este campo é obrigatório",
                            validate: (v) => (v === password ? true : "As senhas não coincidem"),
                        })}
                    />
                </>
            }

            <FormControlLabel
                control={
                    <Switch
                        disabled={loading || isSubmitting || isView}
                        {...register("isActive")}
                        defaultChecked={defaultValues?.isActive ?? true}
                    />
                }
                label="Ativo"
            />

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || isSubmitting || !isValid || (isCreate && !isDirty)}
                >
                    {submitLabel}
                </Button>
            </Box>
        </Box>
    );
}