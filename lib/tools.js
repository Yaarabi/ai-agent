
import axios from "axios";
import 'dotenv/config';

const ig_user_id = process.env.IG_USER_ID;
const access_token = process.env.ACCESS_TOKEN;
const imageUrl = "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

const data = [
    { transaction_id: 'T1001', customer_id: 'C001', payment_amount: 125.50, payment_date: '2021-10-05', payment_status: 'Paid' },
    { transaction_id: 'T1002', customer_id: 'C002', payment_amount: 89.99, payment_date: '2021-10-06', payment_status: 'Unpaid' },
    { transaction_id: 'T1003', customer_id: 'C003', payment_amount: 120.00, payment_date: '2021-10-07', payment_status: 'Paid' },
    { transaction_id: 'T1004', customer_id: 'C002', payment_amount: 54.30, payment_date: '2021-10-05', payment_status: 'Paid' },
    { transaction_id: 'T1005', customer_id: 'C001', payment_amount: 210.20, payment_date: '2021-10-08', payment_status: 'Pending' }
];

export function getPaymentStatus({transactionId}) {
    const transaction = data.find(row => row.transaction_id === transactionId);
    if (transaction) {
        return JSON.stringify({ status: transaction.payment_status });
    } 
    return JSON.stringify({ error: 'transaction id not found.' });
}

export function getPaymentDate({transactionId}) {
    const transaction = data.find(row => row.transaction_id === transactionId);
    if (transaction) {
        return JSON.stringify({ date: transaction.payment_date });
    }
    return JSON.stringify({ error: 'transaction id not found.' });
}


export async function postToInstagram({caption}) {
    const container = await axios.post(
                `https://graph.facebook.com/v20.0/${ig_user_id}/media`,
                {
                image_url: imageUrl,
                caption,
                access_token: access_token,
                }
            );

    await axios.post(
                `https://graph.facebook.com/v20.0/${ig_user_id}/media_publish`,
                {
                creation_id: container.data.id,
                access_token: access_token,
                }
            );

    return "✅ Post published successfully!";
}

export const tools = [
    {
        "type": "function",
        "function": {
            "name": "getPaymentStatus",
            "description": "Get payment status of a transaction",
            "parameters": {
                "type": "object",
                "properties": {
                    "transactionId": {
                        "type": "string",
                        "description": "The transaction id.",
                    }
                },
                "required": ["transactionId"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "getPaymentDate",
            "description": "Get the payment date of a transaction",
            "parameters": {
                "type": "object",
                "properties": {
                    "transactionId": {
                        "type": "string",
                        "description": "The transaction id.",
                    }
                },
                "required": ["transactionId"],
            },
        },
    },
    {
    "type": "function",
    "function": {
        "name": "postToInstagram",
        "description": "Create a new Instagram post",
        "parameters": {
        "type": "object",
        "properties": {
            "caption": {
            "type": "string",
            "description": "The text caption of the Instagram post."
            }
        },
        "required": ["caption"]
        }
    }
    }

]