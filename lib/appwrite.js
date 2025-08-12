import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.hyc.hyc",
  projectId: "6732be3b0006dadcd401",
  storageId: "67337759001a33826b23",
  databaseId: "67337426002e63a6f7c8",
  userCollectionId: "6733746f003bea2a6958",
  videoCollectionId: "6733749f00297909ba4d",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Add these functions to your appwrite.js file

// Request password recovery
export async function forgotPassword(email) {
  try {
    const result = await account.createRecovery(
      email,
      "hyc-app://reset-password?userId={{userId}}&secret={{secret}}"
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

// Complete password reset
export async function resetPassword(
  userId,
  secret,
  newPassword,
  confirmPassword
) {
  try {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const result = await account.updateRecovery(
      userId,
      secret,
      newPassword,
      confirmPassword
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}
// In appwrite.js file, add this to the exports
export { account };
