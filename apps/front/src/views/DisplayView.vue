<script setup lang="ts">
import type { Quiz, Team } from "types";
import { io } from "socket.io-client";
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import TeamCard from "@/components/TeamComponent.vue";
import buzzSound from "@/assets/sounds/buzzanswer.wav";
import buzzGood from "@/assets/sounds/buzzgood.wav";
import buzzBad from "@/assets/sounds/buzzbad.wav";

const { t } = useI18n();
const route = useRoute();
const buzzAnswer = new Audio(buzzSound);
const buzzWin = new Audio(buzzGood);
const buzzLose = new Audio(buzzBad);

const socket = io(import.meta.env.VITE_BACK_URL, {
  autoConnect: false,
});
const quizID = route.params.id;
const origin = window.location.origin;
const pathname = window.location.pathname;
const URL = `${origin}${pathname}#/${quizID}`;

let teams: Ref<Team[]> = ref([]);
let quizName: Ref<string> = ref("");
let QRCode: Ref<string> = ref("");
let started: Ref<boolean> = ref(false);
let showCode: Ref<boolean> = ref(false);
let fontSizeBase = 7;
let error: Ref<string> = ref("");
let finished: Ref<boolean> = ref(false);

if (!quizID) {
  error.value = t("message.quiz.missing");
} else {
  socket.connect();
  socket.emit("check-quiz", quizID, true);
}

socket.on("check-quiz", (quiz: Quiz, fromDisplay: boolean) => {
  if (quiz) {
    if (fromDisplay) socket.emit("display-quiz", quizID, URL);
  } else error.value = t("message.quiz.missing");
});

socket.on("quiz-infos", (quiz: Quiz, quizCode: string) => {
  quizName.value = quiz.name;
  started.value = quiz.started;
  teams.value = quiz.teams;
  QRCode.value = quizCode;
});

socket.on("quiz-started", () => (started.value = true));

socket.on("raz", () => {
  teams.value = [];
  quizName.value = "";
});

socket.on("team-added", (teamsArray: Team[]) => {
  teams.value = teamsArray;
  const documentHeight: number = document.documentElement.clientHeight;
  const boardElement: HTMLElement | null =
    document.querySelector(".teams-list");

  if (boardElement) {
    const box = boardElement.getBoundingClientRect();
    if (box.height > documentHeight) {
      fontSizeBase -= 1;
      boardElement.style.fontSize = `${fontSizeBase}vw`;
    }
  }
});

socket.on("show-code", () => (showCode.value = !showCode.value));

socket.on("remove-team", (teamName: string) =>
  teams.value.splice(
    teams.value.indexOf(
      teams.value.filter((team) => team.name === teamName)[0]
    ),
    1
  )
);

socket.on("buzz-win", (winningTeam: Team) => {
  teams.value.filter((team) => team.id === winningTeam.id)[0].active = true;
  buzzAnswer.play();
});

socket.on("win", () => buzzWin.play());

socket.on("lose", () => buzzLose.play());

socket.on(
  "raz-buzz",
  () => (teams.value.filter((team) => team.active === true)[0].active = false)
);

socket.on("add-point", (teamsArray: Team[]) => (teams.value = teamsArray));

socket.on("remove-point", (teamsArray: Team[]) => (teams.value = teamsArray));

socket.on("raz-score", (teamsArray: Team[]) => (teams.value = teamsArray));

socket.on("disconnect", () => {
  teams.value = [];
  quizName.value = "";
  QRCode.value = "";
  started.value = false;
  showCode.value = false;
  finished.value = true;
});
</script>

<template>
  <div>
    <div v-if="finished && !error" class="finished">
      {{ $t("message.quiz.over") }}
    </div>

    <div v-if="!error">
      <h1 class="quiz-name">{{ quizName }}</h1>
      <div v-if="QRCode && !started" class="qr-code">
        <img :src="QRCode" alt="qr-code" />
        <div>
          <a :href="URL" target="_blank">{{ URL }}</a>
        </div>
        <ul v-if="teams.length && !started" class="teams-list-preview">
          <TeamCard
            v-for="team in teams"
            :key="team.id"
            :team="team"
            :preview="true"
          />
        </ul>
      </div>

      <div v-if="started && showCode" class="qr-code-overlay">
        <div class="qr-code-img">
          <img :src="QRCode" alt="qr-code" />
          <div>
            <a :href="URL" target="_blank">{{ URL }}</a>
          </div>
        </div>
      </div>

      <ul
        v-if="teams.length && started"
        class="teams-list"
        style="font-size: 7vw"
      >
        <TeamCard
          v-for="team in teams"
          :key="team.id"
          :team="team"
          :preview="false"
        />
      </ul>
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.quiz-name {
  text-align: center;
  font-size: 100px;
  margin-top: 0;
  background: linear-gradient(51.05deg, #ee2238 -57.1%, #bf1d67 156.72%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}

.qr-code {
  text-align: center;

  &-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: #121212;
  }

  &-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.teams-list {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 140px;
  text-align: center;
  transform: translate(-50%, -50%);

  &-preview {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 40px;
    padding: 0 10%;
    font-size: 40px;
  }
}

.finished,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 80px;
  text-align: center;
}
</style>
