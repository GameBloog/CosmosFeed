import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../../App"

export type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Details"
>

export interface DetailsScreenState {
  isSaved: boolean
}
