export enum Operation {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
}

export const OperationLabels = new Map<Operation, string>([
    [Operation.INCOME, "Receita"],
    [Operation.EXPENSE, "Despesa"],
]);

export const CreateOperationLabels = new Map<Operation, string>([
    [Operation.INCOME, "Nova receita"],
    [Operation.EXPENSE, "Nova despesa"],
]);

export const UpdateOperationLabels = new Map<Operation, string>([
    [Operation.INCOME, "Atualizar receita"],
    [Operation.EXPENSE, "Atualizar despesa"],
]);