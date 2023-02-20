<script setup lang="ts">
import { ref, type Ref } from "vue";
import { io } from "socket.io-client";
import type { Quiz, Team } from "types";
import { useRoute } from "vue-router";
import { nanoid } from "nanoid";
import { useI18n } from "vue-i18n";
import Button from "@/components/ButtonComponent.vue";

const { t } = useI18n();
const route = useRoute();
const socket = io(import.meta.env.VITE_BACK_URL, {
  autoConnect: false,
});
console.log("Back URL => ", import.meta.env.VITE_BACK_URL);
const quizID = route.params.id;

let team: Ref<Team> = ref({
  id: "",
  name: "",
  score: 0,
  active: false,
});
let teamName: Ref<string> = ref("");
let connected: Ref<boolean> = ref(false);
let disableBuzzer: Ref<boolean> = ref(true);
let winner: Ref<boolean> = ref(false);
let error: Ref<string> = ref("");
let finished: Ref<boolean> = ref(false);

if (!quizID) {
  error.value = t("message.quiz.missing");
} else {
  socket.connect();
  socket.emit("check-quiz", quizID, false);
}

const fillTeamName = (e: Event) =>
  (teamName.value = (e.target as HTMLInputElement).value);

const signIn = (e: Event) => {
  e.preventDefault();
  if (teamName.value) {
    team.value = {
      id: nanoid(5),
      name: teamName.value,
      score: 0,
      active: false,
    };
    connected.value = true;
    socket.connect();
    socket.emit("add-team", quizID, team.value, "user");
  }
};

const buzz = () => socket.emit("buzz", team.value.id, quizID);

socket.on("check-quiz", (quiz: Quiz) => {
  if (!quiz) {
    error.value = t("message.quiz.missing");
    socket.disconnect();
  }
});

socket.on("quiz-started", () => (disableBuzzer.value = false));

socket.on("toggle-buzz", (active: boolean) => (disableBuzzer.value = !active));

socket.on("buzz-win", (winningTeam: Team) => {
  disableBuzzer.value = true;

  if (teamName.value === winningTeam.name) winner.value = true;
});

socket.on("raz-buzz", () => {
  disableBuzzer.value = false;
  winner.value = false;
});

socket.on("close", () => socket.disconnect());

socket.on("disconnect", () => {
  finished.value = true;
  connected.value = false;
});
</script>

<template>
  <div>
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="finished && !error" class="finished">
      {{ $t("message.quiz.over") }}
    </div>

    <div v-if="!error && !finished">
      <div v-if="!connected" class="sign-in-wrapper">
        <form @submit="signIn" class="sign-in-form">
          <input
            type="text"
            class="sign-in-input"
            :placeholder="$t('message.user.name')"
            autofocus
            v-model="teamName"
            @keyup="fillTeamName"
          />
          <Button>{{ $t("message.user.play") }}</Button>
        </form>
      </div>

      <div v-if="connected && !finished" class="buzz-wrapper">
        <button
          :disabled="disableBuzzer"
          class="buzz-button"
          :class="{ 'buzz-button-winner': winner }"
          @click="buzz"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sign-in {
  &-wrapper {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  &-form {
    position: inherit;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
  }

  &-todo {
    text-align: center;
    margin-bottom: 10px;
    font-size: 30px;
    font-weight: 700;
  }

  &-input {
    width: 100%;
    height: 50px;
    font-size: 30px;
    padding: 30px 10px;
    text-align: center;
    color: white;
    background-color: rgba(255, 255, 255, 0.4);
    border: 2px solid white;
    border-radius: 10px;
    font-weight: 700;
  }

  &-button {
    width: 100%;
    height: 50px;
    margin-top: 20px;
    font-size: 30px;
    font-weight: 700;
    background: linear-gradient(51.05deg, #ee2238 -57.1%, #bf1d67 156.72%);
    border: none;
    border-radius: 10px;
  }
}

.buzz {
  &-wrapper {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  &-button {
    position: inherit;
    top: 50%;
    left: 50%;
    width: 270px;
    height: 270px;

    border: 3px solid #fff;
    background: #e53030;
    box-shadow: 0 -10px 0 3px darken(#e53030, 10%) inset,
      0 10px 10px rgba(darken(#e53030, 40%), 0.17),
      0 30px rgba(#fff, 0.25) inset;
    border-radius: 50%;
    transform: translate(-50%, -50%);

    &:disabled {
      background: gray;
      box-shadow: 0 -10px 0 3px darken(gray, 10%) inset,
        0 10px 10px rgba(darken(gray, 40%), 0.17), 0 30px rgba(#fff, 0.25) inset;
    }

    &-winner {
      background: #78c200;
      box-shadow: 0 -10px 0 3px darken(#78c200, 10%) inset,
        0 10px 10px rgba(darken(#78c200, 40%), 0.17),
        0 30px rgba(#fff, 0.25) inset;

      &:disabled {
        background: #78c200;
        box-shadow: 0 -10px 0 3px darken(#78c200, 10%) inset,
          0 10px 10px rgba(darken(#78c200, 40%), 0.17),
          0 30px rgba(#fff, 0.25) inset;
      }
    }
  }
}

.finished,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 60px;
  text-align: center;
}
</style>
