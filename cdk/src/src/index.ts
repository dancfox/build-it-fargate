import express from 'express';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import moment from 'moment';
import { object, string, number, date, InferType } from 'yup';

const app = express();
const port = 80;

const client = new DynamoDBClient(process.env.region);
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let nameSchema = object({
  name: string().required().min(2).max(30)
});

const chanceOfFailure = 15;
process.env.chanceOfFailure = chanceOfFailure.toString();

app.get( '/', ( req, res ) => {
  res.status(200).send( 'Welcome to the die roller app!' );
} );

app.post( '/rollDie', async ( req, res) => {

  let isFailure = Math.floor(Math.random() * 100) + 1;

  if ( isFailure <= Number(process.env.chanceOfFailure) ) {
    return res.status(500).send( { error: "Failure" } );
  }

  try {
    await nameSchema.validate(req.body);
  } catch (err) {
      console.log(err);
      return res.status(400).send( { error: err["errors"][0] } );
  }

  const dieRoll = Math.floor(Math.random() * 6) + 1;

  const command = new PutCommand({
    TableName : process.env.databaseTable,
    Item: {
      ID: Math.floor(Math.random() * Math.floor(10000000)).toString(),
      created: moment().format('YYYYMMDD-hhmmss'),
      name: req.body.name,
      dieRoll
    },
  });

  console.log(command);

  try {
    const response = await docClient.send(command);
    console.log(response);
  }
  catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
    return res.send( err );
  }
  return res.status(200).send( { dieRoll } );
});

app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` );
});