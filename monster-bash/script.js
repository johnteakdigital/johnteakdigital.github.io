var monsterBash = new Vue({
  el: '#app',
  data: {
    gameInit : false,
    monsterHp : 100,
    playerHp : 100,
    playerDmg : 0,
    monsterDmg : 0,
    playerHeal : 0,
    status : []
  },
  watch: {
    playerHp: function() {
      if (this.playerHp < 1) {
        this.updateStatus('player', 0, 'death')
        this.playerHp = 0
      }
    },
    monsterHp: function() {
      if (this.monsterHp < 1) {
        this.updateStatus('monster', 0, 'death')
        this.monsterHp = 0
      }
    }
  },
  computed: {
  },
  methods: {
    startNewGame: function() {
      this.gameInit = !this.gameInit
      this.monsterHp = 100
      this.playerHp = 100
      this.status = []
    },
    attack: function() {
      this.monsterAttack(8)
      this.playerDmg = this.computeStatus(5);
      this.updateStatus('player',this.playerDmg, 'attacks');
    },
    specialAttack: function() {
      this.monsterAttack(10)
      this.playerDmg = this.computeStatus(8);
      this.updateStatus('player',this.playerDmg, 'summons fireball');
    },
    heal: function() {
      this.monsterAttack(5)
      this.playerHeal = this.computeStatus(10,1);
      this.updateStatus('player',this.playerHeal, 'healed');
    },
    monsterAttack: function(str) {
      this.monsterDmg = this.computeStatus(str);
      this.updateStatus('monster',this.monsterDmg, 'attacks');
    },
    updateStatus: function(char, str, type) {
      if (type != 'death' && this.playerHp > 0 && this.monsterHp > 0) {
        this.status.unshift({char:char, str:str, type:type})
        if (char == 'player') {
          if (type == 'healed') this.playerHp += str
          else this.monsterHp -= str
        } else {
          this.playerHp -= str
        }
      } else {
        var dead = '';
        if (this.playerHp > 0) dead = 'monster'
        else dead = 'player'
        this.status.unshift({char:dead, str:str, type:'death'})
      }
    },
    computeStatus: function(n, min) {
      var min = min || 0;
      return Math.floor((Math.random() * n) + min)
    },
    damageAmount: function(n) {
      if (n < 25) return 'danger'
      if (n < 50) return 'warning'
      else return 'success'
    }
  }
})
