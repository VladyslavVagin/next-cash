"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { transactionFormSchema } from "@/schemas/transactionFormSchema";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Input } from "./ui/input";
import type { Category } from "@/types/Category";

type Props = {
  categories: Category[];
  onSubmit: (data: z.input<typeof transactionFormSchema>) => Promise<void>;
  defaultValues?: {
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date;
    transactionType: "income" | "expense";
  }
}

const TransactionForm = ({ categories, onSubmit, defaultValues }: Props) => {
  const form = useForm<z.input<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: defaultValues ? {
      amount: defaultValues.amount.toString(),
      categoryId: defaultValues.categoryId.toString(),
      description: defaultValues.description,
      transactionDate: defaultValues.transactionDate.toISOString(),
      transactionType: defaultValues.transactionType,
    } : {
      amount: "0",
      categoryId: "0",
      description: "",
      transactionDate: new Date().toISOString(),
      transactionType: "income",
    },
  });

  const transactionType = form.watch("transactionType");
  const fileteredCategories = categories.filter(
    (category) => category.type === transactionType
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        <fieldset disabled={form.formState.isSubmitting} className="grid grid-cols-2 gap-y-5 gap-x-2">
          <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(newValue) => {
                        field.onChange(newValue);
                        form.setValue("categoryId", 0);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fileteredCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="transactionDate"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Transaction Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                        >
                          <CalendarIcon />
                          {field.value && typeof field.value === "string" ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          disabled={{
                            after: new Date(),
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={String(field.value || "")}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </fieldset>
        <fieldset disabled={form.formState.isSubmitting} className="mt-5 flex flex-col gap-y-5">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full">
            {defaultValues ? "Update Transaction" : "Add Transaction"}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default TransactionForm;
