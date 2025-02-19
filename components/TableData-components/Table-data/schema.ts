import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const expenseSchema = z.object({
    
    index: z.string(),
    Repair_ID: z.string(),
    Username: z.number(),
    BookQR: z.string(),
    FK_BookID: z.string(),
    Bookname: z.string(),
    BookType: z.string(),
    Bookaddress: z.string(),
    Bookstate: z.string(),
    ServiceNote: z.string(),
    ServiceByName: z.string(),
    ServiceDate: z.string(),
    StatusName: z.string(),
    StatusDate: z.string(),

});

export type Expense = z.infer<typeof expenseSchema>;